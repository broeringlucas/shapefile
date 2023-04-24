const shp = require('shapefile');
const db = require('../config/db');
const wkt = require('wkt');
const decompress = require("decompress");


exports.readShapefile = async (req, res) => {
  try {
    const file = req.file.path
    const unzipResult = await decompress(`${file}`, "snv_dividido"); 
    let filePath
    for(let i = 0; i <= unzipResult.length - 1; i++)
        if (unzipResult[i].path === 'icm.shp') {
            filePath = `./snv_dividido/${unzipResult[i].path}`
        }

    shp.open(filePath)
      .then(source => source.read()
        .then(function insertToTable(result) {
          if (result.done) return;
            //Converter geometry para tipo wkt
            type_wkt = wkt.stringify(result.value.geometry)
            let sql = `
              INSERT INTO TB_RODOVIAS_TESTE (
                ID,
                CODE,
                br,
                uf,
                km,
                km_inicial,
                km_final,
                extensao,
                superficie,
                geom
              )
              VALUES(
                '${result.value.properties.ID}',
                '${result.value.properties.CODE}',
                '${result.value.properties.HIGHWAY}',
                '${result.value.properties.STATE}',
                '${result.value.properties.KM}',
                '${result.value.properties.KM_INI}',
                '${result.value.properties.KM_FIN}',
                '${result.value.properties.KM_FIN - result.value.properties.KM_INI}',
                '${result.value.properties.SURFACE}',
                ST_GeomFromText('${type_wkt}')
              )`;

            db.query(sql);
            return source.read().then(insertToTable);
        }))
      .then(() => {
        res.status(200).send('Registros inseridos com sucesso.');
        })
      .catch(error => {
        console.error(error.stack);
        res.status(500).send("Ocorreu um erro ao inserir os registros.");
      });

  } catch(error) {
    console.log(error)
    res.status(500).send("Ocorreu um erro ao ler o shapefile.")
  }
}
