drop table if exists station;
create table station
(
	station_id 				int(10) unsigned not null auto_increment,
	call_sign				varchar(4)  not null,
	band				    varchar(2)  not null,
	name					varchar(64) null, -- optional name of station
	frequency				varchar(6)  not null,
	city					varchar(64) not null,
	state					varchar(2)  not null, -- being lazy should be lu table
	lat						decimal(10, 8) not null,
	lng						decimal(11, 8) not null,

	added_at                datetime          not null,
	modified_at             timestamp         not null   default current_timestamp on update current_timestamp,
 
	primary key (station_id)
) ENGINE=innodb DEFAULT CHARSET=utf8 AUTO_INCREMENT=1000; -- start at id 1000
