

## Project info

**URL**: www.wasteconnect.live



🌱 WasteConnect

A web-based waste management system designed to streamline pickup scheduling, digital payments, user wallets, and more—aimed at improving waste-management workflows.

 📖 Overview

 WasteConnect offers a tech-forward solution by digitizing service interactions—enabling scheduling, payments, and user engagement in one system.

🧩 Features

* Pickup orders: Users can request waste pickup via forms (`order.php`, `order-summary.php`).
* **User management**: Secure registration and login mechanisms (`signin.html`, `signin.php`, `login.php/login1.php`).
* **Digital wallet**: Track and manage service credits and wallet balance (`wallet.php`).
* **Payment handling**: Support for online payments through `sql.php` integrations.
* **Informational pages**: Static content-driven pages like `about.php`, `team.php`.
* **Responsive UI**: Built using HTML, CSS, PHP, and JavaScript for modern browsers.



🛡️ Security & Data Handling

* The project centralizes SQL commands in `sql.php`; consider using **prepared statements** to reduce SQL injection risk.
* Sessions and form handling occur across multiple PHP files—ensure **CSRF protection** and input sanitization wherever applicable.
* Logging and validation are minimal; consider adding robust **error handling** and defensive coding patterns for production use.

 🧑‍💻 How to Contribute

1. Fork this repo.
2. Create a branch (`feature/awesome-thing`).
3. Commit and push changes.
4. Submit a pull request detailing your enhancements.

