const shp = require('shapefile');
const db = require('../config/db');
const wkt = require('wkt')

shp.open('./shapefile/snv_dividido/icm')
  .then(source => source.read()
    .then(function insertToTable(result) {
      if (result.done) return;
        //Converter geometry para tipo wkt
        type_wkt = wkt.stringify(result.value.geometry)
        let sql = `
          INSERT INTO tb_rodovias_teste (
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

          )`
        db.execute(sql);
        return source.read().then(insertToTable);
    }))
  .catch(error => console.error(error.stack));
