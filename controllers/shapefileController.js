const shp = require('shapefile');
const db = require('../config/db');
const wkt = require('wkt');
const decompress = require("decompress");


const readShapefile = async function() {
  // Aonde está snv_dividido.zip vai entrar o folder que o adm vai enviar 
  // Esse else vai lançar uma exceção caso não seja possível ler o arquivo postado, caso não tenha um file.shp nele
  const unzipResult = await decompress("snv_dividido.zip", "snv_dividido"); 
  let filePath
  for(let i = 0; i <= unzipResult.length - 1; i++)
      if (unzipResult[i].path === 'icm.shp') {
          filePath = `./snv_dividido/${unzipResult[i].path}`
      } else {
          console.log('erro')
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
    .catch(error => console.error(error.stack));
};

readShapefile();