-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql_db:3306
-- Generation Time: Apr 02, 2025 at 10:04 PM
-- Server version: 5.7.44
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `Lease_Contracts`
--

CREATE TABLE `Lease_Contracts` (
  `contract_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `deposit_amount` decimal(10,2) NOT NULL,
  `status` enum('active','terminated') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Lease_Contracts`
--

INSERT INTO `Lease_Contracts` (`contract_id`, `room_id`, `start_date`, `end_date`, `deposit_amount`, `status`) VALUES
(3, 7, '2025-01-01', '2025-03-03', 1212.00, 'active'),
(4, 5, '2025-01-01', '2025-03-03', 1212.00, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `Maintenance_Requests`
--

CREATE TABLE `Maintenance_Requests` (
  `request_id` int(11) NOT NULL,
  `tenant_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `request_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text NOT NULL,
  `status` enum('pending','in_progress','completed') DEFAULT 'pending',
  `resolved_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Monthly_Bills`
--

CREATE TABLE `Monthly_Bills` (
  `bill_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `billing_date` date NOT NULL,
  `rent_amount` decimal(10,2) NOT NULL,
  `electricity_usage` int(11) NOT NULL,
  `electricity_cost` decimal(10,2) NOT NULL,
  `water_usage` int(11) NOT NULL,
  `water_cost` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Monthly_Bills`
--

INSERT INTO `Monthly_Bills` (`bill_id`, `room_id`, `billing_date`, `rent_amount`, `electricity_usage`, `electricity_cost`, `water_usage`, `water_cost`, `total_amount`) VALUES
(1, 3, '2025-04-01', 1313.00, 2121, 3.00, 121, 31.00, 2121.00),
(3, 3, '2025-03-31', 1313.00, 2121, 3.00, 121, 31.00, 2121.00),
(4, 1, '2025-04-01', 2121.00, 21212, 1312.00, 121, 212.00, 3121.00),
(5, 14, '2025-04-16', 211.00, 2121, 31212.00, 3121, 31212.00, 3121.00);

-- --------------------------------------------------------

--
-- Table structure for table `Reservation_Payments`
--

CREATE TABLE `Reservation_Payments` (
  `payment_id` int(11) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount_paid` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','bank_transfer','credit_card') DEFAULT NULL,
  `status` enum('paid','pending','refunded') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Reservation_Payments`
--

INSERT INTO `Reservation_Payments` (`payment_id`, `reservation_id`, `payment_date`, `amount_paid`, `payment_method`, `status`) VALUES
(2, 4, '2025-04-02 16:16:00', 1200.00, 'cash', 'paid'),
(3, 5, '2025-04-02 16:28:40', 1200.00, 'cash', 'paid'),
(4, 6, '2025-04-02 16:40:58', 1234.00, 'cash', 'paid'),
(5, 7, '2025-04-02 16:52:54', 1220.00, 'cash', 'paid');

-- --------------------------------------------------------

--
-- Table structure for table `Rooms`
--

CREATE TABLE `Rooms` (
  `room_id` int(11) NOT NULL,
  `room_number` varchar(10) NOT NULL,
  `floor` int(11) NOT NULL,
  `room_type_id` int(11) NOT NULL,
  `status` enum('available','reserved','occupied','maintenance') DEFAULT 'available',
  `monthly_rent` decimal(10,2) NOT NULL,
  `max_tenants` int(11) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Rooms`
--

INSERT INTO `Rooms` (`room_id`, `room_number`, `floor`, `room_type_id`, `status`, `monthly_rent`, `max_tenants`) VALUES
(1, '101', 1, 2, 'reserved', 4500.00, 2),
(2, '102', 1, 3, 'available', 8500.00, 4),
(3, '103', 1, 4, 'available', 9000.00, 4),
(4, '104', 1, 1, 'available', 4500.00, 2),
(5, '105', 1, 1, 'reserved', 4500.00, 2),
(6, '106', 1, 1, 'available', 4500.00, 2),
(7, '201', 2, 2, 'reserved', 4500.00, 2),
(8, '202', 2, 3, 'available', 8500.00, 4),
(9, '203', 2, 4, 'available', 9000.00, 4),
(10, '204', 2, 1, 'available', 4500.00, 2),
(11, '205', 2, 1, 'available', 4500.00, 2),
(12, '206', 2, 1, 'available', 4500.00, 2),
(13, '301', 3, 2, 'available', 4500.00, 2),
(14, '302', 3, 3, 'available', 8500.00, 4),
(15, '303', 3, 4, 'available', 9000.00, 4),
(16, '304', 3, 1, 'available', 4500.00, 2),
(17, '305', 3, 1, 'available', 4500.00, 2),
(18, '306', 3, 1, 'available', 4500.00, 2),
(19, '401', 4, 2, 'available', 4500.00, 2),
(20, '402', 4, 3, 'available', 8500.00, 4),
(21, '403', 4, 4, 'available', 9000.00, 4),
(22, '404', 4, 1, 'available', 4500.00, 2),
(23, '405', 4, 1, 'available', 4500.00, 2),
(24, '406', 4, 1, 'reserved', 4500.00, 2);

-- --------------------------------------------------------

--
-- Table structure for table `Room_Reservations`
--

CREATE TABLE `Room_Reservations` (
  `reservation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `reservation_date` date NOT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `payment_status` enum('pending','paid','refunded') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Room_Reservations`
--

INSERT INTO `Room_Reservations` (`reservation_id`, `user_id`, `room_id`, `reservation_date`, `status`, `payment_status`) VALUES
(4, 1, 7, '2025-01-02', 'pending', 'paid'),
(5, 1, 24, '2025-01-02', 'pending', 'paid'),
(6, 1, 5, '2025-01-01', 'pending', 'paid'),
(7, 1, 1, '2025-01-02', 'pending', 'paid');

-- --------------------------------------------------------

--
-- Table structure for table `Room_Tenants`
--

CREATE TABLE `Room_Tenants` (
  `tenant_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `contract_id` int(11) NOT NULL,
  `move_in_date` date NOT NULL,
  `move_out_date` date DEFAULT NULL,
  `rent_share` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Room_Types`
--

CREATE TABLE `Room_Types` (
  `room_type_id` int(11) NOT NULL,
  `type_name` varchar(50) CHARACTER SET utf8 NOT NULL,
  `description` text CHARACTER SET utf8 NOT NULL,
  `default_rent` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Room_Types`
--

INSERT INTO `Room_Types` (`room_type_id`, `type_name`, `description`, `default_rent`) VALUES
(1, 'Standard A', 'ห้องพักเตียงเดี่ยว, 1 ห้องนอน, 1 ห้องน้ำ', 4500.00),
(2, 'Standard B', 'ห้องพักเตียงคู่, 1 ห้องนอน, 1 ห้องน้ำ', 4500.00),
(3, 'Suite A', 'เตียงเดี่ยว, 2 ห้องนอน, 1 ห้องนั่งเล่น, 1 ห้องน้ำ', 8500.00),
(4, 'Suite B', 'เตียงเดี่ยว, 2 ห้องนอน, 1 ห้องนั่งเล่น, 2 ห้องน้ำ', 9000.00);

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8 NOT NULL,
  `PASSWORD` varchar(255) CHARACTER SET utf8 NOT NULL,
  `firstname` varchar(255) CHARACTER SET utf8 NOT NULL,
  `lastname` varchar(255) CHARACTER SET utf8 NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8 NOT NULL,
  `role` enum('guest','tenant','admin') CHARACTER SET utf8 DEFAULT 'guest',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`user_id`, `username`, `PASSWORD`, `firstname`, `lastname`, `email`, `phone`, `role`, `created_at`) VALUES
(1, 'Admin', '1234', 'Admini', 'strator', 'Administrator@apartment.org.th', '0000000000', 'admin', '2025-03-29 21:04:08'),
(3, 'abc', '1234', 'aaa', 'bbb', 'abc@gmail.com', '0123456789', 'tenant', '2025-03-29 22:14:19'),
(4, 'b6621601131', 'sasa', 'sasa', 'sasa', 'poomza5231@gmail.com', 'sasas', 'guest', '2025-03-31 09:44:34'),
(8, 'Meow', '1234', 'Maw', 'Meow', 'sakorn.k@ku.th', '0921213434', 'guest', '2025-04-01 14:26:16'),
(9, 'ChampInwza007', 'champzaza', 'Champza', 'Eiei', 'Champ007@email.com', '0870070707', 'guest', '2025-04-02 01:55:15'),
(11, 'Admin', 'qaqq', 'sasa', 'sasa', 'kittinat045@gmai.com', '212121', 'guest', '2025-04-02 16:24:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Lease_Contracts`
--
ALTER TABLE `Lease_Contracts`
  ADD PRIMARY KEY (`contract_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `Maintenance_Requests`
--
ALTER TABLE `Maintenance_Requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `Monthly_Bills`
--
ALTER TABLE `Monthly_Bills`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `Monthly_Bills_ibfk_1` (`room_id`);

--
-- Indexes for table `Reservation_Payments`
--
ALTER TABLE `Reservation_Payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `reservation_id` (`reservation_id`);

--
-- Indexes for table `Rooms`
--
ALTER TABLE `Rooms`
  ADD PRIMARY KEY (`room_id`),
  ADD UNIQUE KEY `room_number` (`room_number`),
  ADD KEY `room_type_id` (`room_type_id`);

--
-- Indexes for table `Room_Reservations`
--
ALTER TABLE `Room_Reservations`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `Room_Tenants`
--
ALTER TABLE `Room_Tenants`
  ADD PRIMARY KEY (`tenant_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `contract_id` (`contract_id`);

--
-- Indexes for table `Room_Types`
--
ALTER TABLE `Room_Types`
  ADD PRIMARY KEY (`room_type_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Lease_Contracts`
--
ALTER TABLE `Lease_Contracts`
  MODIFY `contract_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Maintenance_Requests`
--
ALTER TABLE `Maintenance_Requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Monthly_Bills`
--
ALTER TABLE `Monthly_Bills`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Reservation_Payments`
--
ALTER TABLE `Reservation_Payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Rooms`
--
ALTER TABLE `Rooms`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `Room_Reservations`
--
ALTER TABLE `Room_Reservations`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Room_Tenants`
--
ALTER TABLE `Room_Tenants`
  MODIFY `tenant_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Room_Types`
--
ALTER TABLE `Room_Types`
  MODIFY `room_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Lease_Contracts`
--
ALTER TABLE `Lease_Contracts`
  ADD CONSTRAINT `Lease_Contracts_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `Rooms` (`room_id`);

--
-- Constraints for table `Maintenance_Requests`
--
ALTER TABLE `Maintenance_Requests`
  ADD CONSTRAINT `Maintenance_Requests_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `Room_Tenants` (`tenant_id`),
  ADD CONSTRAINT `Maintenance_Requests_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `Rooms` (`room_id`);

--
-- Constraints for table `Reservation_Payments`
--
ALTER TABLE `Reservation_Payments`
  ADD CONSTRAINT `Reservation_Payments_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `Room_Reservations` (`reservation_id`);

--
-- Constraints for table `Rooms`
--
ALTER TABLE `Rooms`
  ADD CONSTRAINT `Rooms_ibfk_1` FOREIGN KEY (`room_type_id`) REFERENCES `Room_Types` (`room_type_id`);

--
-- Constraints for table `Room_Reservations`
--
ALTER TABLE `Room_Reservations`
  ADD CONSTRAINT `Room_Reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  ADD CONSTRAINT `Room_Reservations_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `Rooms` (`room_id`);

--
-- Constraints for table `Room_Tenants`
--
ALTER TABLE `Room_Tenants`
  ADD CONSTRAINT `Room_Tenants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  ADD CONSTRAINT `Room_Tenants_ibfk_2` FOREIGN KEY (`contract_id`) REFERENCES `Lease_Contracts` (`contract_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
