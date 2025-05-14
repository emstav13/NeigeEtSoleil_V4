drop database if exists orange_CL_LM ; 
create database orange_CL_LM; 
use orange_CL_LM; 

create table client (
	idclient int(5) not null auto_increment, 
	nom varchar(50), 
	prenom varchar(50), 
	adresse varchar(50), 
	email varchar(50), 
	tel varchar(20), 
	primary key(idclient)
);
create table telephone (
	idtel int(5) not null auto_increment, 
	designation varchar(50), 
	dateAchat date, 
	prixAchat float, 
	etat enum("Excellent", "Bien", "Moyen", "Mauvais"), 
	idclient int(5) not null, 
	primary key(idtel), 
	foreign key (idclient) references client(idclient)
);
create table technicien (
	idtechnicien int(5) not null auto_increment, 
	nom varchar(50), 
	prenom varchar(50), 
	qualification varchar(50), 
	email varchar(50), 
	mdp varchar(50),
	tel varchar(20), 
	primary key(idtechnicien)
);
create table intervention(
	idinter int(5) not null auto_increment, 
	description text, 
	dateInter date , 
	prixInter float , 
	idtechnicien int(5) not null, 
	idtel int(5) not null, 
	primary key(idinter), 
	foreign key (idtechnicien) references technicien(idtechnicien), 
	foreign key (idtel) references telephone(idtel)
); 


delimiter  $
create procedure deleteClient (IN p_idclient INT)
Begin 
delete from intervention where idtel in 
	(select idtel from telephone where idclient = p_idclient); 
delete from telephone where idclient = p_idclient; 
delete from client where idclient = p_idclient; 

End  $

delimiter   ;

# Lister : nom et prenom des clients,  la designation de leur telephone, 
# avec la description de la panne et sa date.

create view Listing as (
select c.nom, c.prenom, t.designation, i.description, i.dateInter
from client c 
inner join telephone t on c.idclient = t.idclient
inner join intervention i on i.idtel = t.idtel 
where i.dateInter like "2024%"
);

















