module.exports = function (type){
    if(type == 1){
        return `SELECT * FROM padre WHERE cedula IN 
        ((SELECT cedula FROM padre) 
        EXCEPT
        (SELECT hijode FROM hijo WHERE hijode IS NOT NULL));`;
    }else if(type == 2){
        return `SELECT * FROM hijo WHERE hijode IS NULL;`;
    }else{
        return `SELECT padre.*, (CASE WHEN hijode IS NULL THEN 0 ELSE COUNT(cedula) END) AS numHijos
        FROM padre 
        LEFT OUTER JOIN hijo
        ON cedula = hijode
        GROUP BY cedula;`;
    }
}