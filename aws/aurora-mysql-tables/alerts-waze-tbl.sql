CREATE TABLE `wazer`.`alerts` (
  `uuid` varchar(30) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `subtype` varchar(100) DEFAULT NULL,
  `street` varchar(45) DEFAULT NULL,
  `reportRating` int(11) DEFAULT NULL,
  `reportDescription` varchar(45) DEFAULT NULL,
  `reliability` int(11) DEFAULT NULL,
  `pubMillis` bigint(50) DEFAULT NULL,
  `nThumbsUp` int(11) DEFAULT NULL,
  `magvar` int(11) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `confidence` int(11) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `wid` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`wid`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1