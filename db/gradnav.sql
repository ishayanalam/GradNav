-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 19, 2025 at 12:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gradnav`
--

-- --------------------------------------------------------

--
-- Table structure for table `counseling`
--

CREATE TABLE `counseling` (
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `topic` varchar(255) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `counseling_date` date DEFAULT NULL,
  `counseling_time` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `counseling`
--

INSERT INTO `counseling` (`name`, `email`, `topic`, `phone`, `counseling_date`, `counseling_time`) VALUES
('John Doe', 'cyn@yahoo.com', 'Career Guidance', '1234567890', '2025-04-20', '15:00'),
('Shayan Alam', 'cyn@yahoo.com', 'Career about cse', '1234567890', '2025-03-20', '15:00'),
('Shayan Alam', 'cyn@yahoo.com', 'Career about cse', '1234567890', '2025-03-20', '15:00'),
('Shayan Alam', 'cyn@yahoo.com', 'Career at cse,bba', '1234567890', '2025-03-20', '15:00');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `institute` varchar(100) DEFAULT NULL,
  `education_level` varchar(50) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`name`, `email`, `institute`, `education_level`, `password`, `token`, `is_admin`) VALUES
('Admin User', 'admin@gradnav.com', 'Admin Institute', 'Admin', '$2b$10$hCnhCvOilYOoHyYbuH8UhOIm/jV5qICRglnxrfpwTyycEqNuXBwGa', NULL, 1),
('Shayan', 'cyn@yahoo.com', 'ULAB', 'HSC', '$2b$10$L0/NPAvcPnxrZxmMSCVZo.0HtAXqKVritB9vGhhXnKGrKhvjZmCi6', NULL, 0),
('ShayanALam', 'cynaa@yahoo.com', 'ULAB', 'HSC', '$2b$10$tMgjmOEfVwniD2Xhwhj9HOOFP6DpkzlZsnUncCCranfsCMJ0swgDO', NULL, 0),
('Shihab', 'shihab@ulab.com', 'British Council', 'A lvls', '$2b$10$8ICvHgboQ2BFnrWfoVnfZuEgEiYciZV3N42PcqtNdivfewNywxrda', NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `counseling`
--
ALTER TABLE `counseling`
  ADD KEY `email` (`email`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `counseling`
--
ALTER TABLE `counseling`
  ADD CONSTRAINT `counseling_ibfk_1` FOREIGN KEY (`email`) REFERENCES `user` (`email`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
