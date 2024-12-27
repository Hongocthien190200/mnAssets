const { CronJob } = require('cron');
const nodemailer = require('nodemailer');
const Devices = require('../Models/devices');
const User = require('../Models/User');
function startCron() {
    const specificTime = '00 07 * * *'; // 
    const specificJob = new CronJob(specificTime, async () => {
        try {
            const devices = await Devices.find({
                statusId: '64ffe524aedbb65828b97cb5',
                maintenanceSchedule: { $exists: true, $ne: null }
            });
            // Ngày hiện tại
            const currentDate = new Date();
            const devicesDueForMaintenance = [];

            // Duyệt qua từng thiết bị và kiểm tra ngày bảo dưỡng
            for (const device of devices) {
                const nextMaintenanceDate = new Date(device.nextMaintenance);
                // So sánh ngày hiện tại với ngày bảo dưỡng
                if (currentDate >= nextMaintenanceDate) {
                    devicesDueForMaintenance.push({
                        _id: device._id,
                        deviceName: device.deviceName,
                        deviceCode: device.deviceCode,
                        maintenanceStatus: device.maintenanceStatus
                    });
                }
            }

            if (devicesDueForMaintenance.length > 0) {
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: "587",
                    secure: false,
                    auth: {
                        user: process.env.Mail_USER,
                        pass: process.env.PassMail
                    }
                });
                const devicesToUpdate = devicesDueForMaintenance.filter(device => device.maintenanceStatus !== '1');
                const mailOptions = {
                    from: `SOS MANAGER <${process.env.Mail_USER}>`,
                    to: email,
                    subject: 'THÔNG BÁO ĐẾN KỲ BẢO DƯỠNG THIẾT BỊ',
                    html:
                        `
                        <html>
                        <head>
                            <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                background-color: #f4f4f4;
                                color: #333;
                            }
                            
                            #container {
                                max-width: 600px;
                                margin: 0 auto;
                                border-radius: 8px;
                                background-color: #fff;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                text-align: center;
                            }
                            .title{
                                font-size: 22px;
                                font-weight: 600;
                                padding: 12px 12px;
                                border-radius: 8px 8px 0 0;
                                color: #fff;
                                background-color: #247C5C;
                                
                            }
                            .device{
                                background-color: #E8F8F1;
                            }
                            .device-title{
                                font-size: 18px;
                                padding: 8px 12px;
                                color: black;
                            }
                            .device-dt{
                                margin: 0px 24px;
                                padding: 4px 0;
                                border-radius: 8px;
                                background-color: #fff;
                            }
                            .reminder {
                                padding: 8px;
                                font-weight: 600;
                                color: #247C5C;
                            }
                            
                            ul {
                                list-style-type: none;
                                padding: 0;
                            }
                            li{
                                margin-bottom: 8px;
                            }
                            </style>
                        </head>
                        <body>
                            <div id="container">
                                <div class="title">
                                    THÔNG BÁO
                                </div>
                                <div class="device">
                                    <div class="device-title">Các thiết bị sau đây đã đến hạn bảo dưỡng định kỳ:</div>
                                    <div class="device-dt">
                                    <ul>
                                    ${devicesDueForMaintenance.map((device) => `
                                        <li>Thiết bị: ${device.deviceName} - Mã thiết bị: ${device.deviceCode}</li>
                                    `).join("")}
                                </ul>
                                    </div>
                                    <div class="reminder">
                                        Quản trị viên vui lòng lên lịch bảo dưỡng
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
                };

                try {
                    const users = await User.find({}); // Lấy tất cả người dùng
                    for (const user of users) {
                        mailOptions.to = user.email; // Đặt địa chỉ email người dùng
                        await transporter.sendMail(mailOptions);
                    }

                    // Cập nhật trạng thái bảo dưỡng của thiết bị
                    await Devices.updateMany(
                        { _id: { $in: devicesToUpdate.map((device) => device._id) } },
                        { $set: { maintenanceStatus: true } }
                    );
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, null, false, 'Asia/Ho_Chi_Minh');
    specificJob.start();
}

module.exports = { startCron };
