
module.exports= queries={

    GetVols:(DATETIME,depart,arrivee,palces)=>`SELECT vols.id,nom,description,prix,places,date_vol.time_depart,time_arrivee,escale.escal,escale_arrivee,escale_depart FROM vols , date_vol,escale WHERE  vols.id=date_vol.vol_id  AND vols.id=escale.vol_id AND vols.depart='${depart}' AND vols.arrivee='${arrivee}' AND  '${DATETIME}' <date_vol.time_depart AND (SELECT COUNT(*) FROM reservation WHERE vol_id=vols.id)+'${palces}'<vols.places  `,
    InsertClient:(client)=>` INSERT INTO client(nom, prenom,passport, email, tele, code) VALUES ('${client.nom}','${client.prenom}','${client.passport}','${client.email}','${client.tele}',"hgfdfhgjkhjgfg") `,
    InsertReservation:(data)=>`INSERT INTO reservation(vol_id,client_id) VALUES('${data.id}','${data.client_id}')`
}
