const bcrypt = require('bcrypt');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

let refreshTokensArr = [];
const generateRandomString = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'; // Bảng chữ cái thường và số
    let randomString = '';

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }

    return randomString;
}

const authController = {
    show: async (req, res) => {
        try {
            const alluser = await User.find({});
            const dataUser = alluser.map((user) => {
                return {
                    _id: user._id,
                    fullname: user.fullname,
                    position: user.position,
                    email: user.email,
                    admin: user.admin ? 'quản lý' : 'người dùng'
                }
            })
            res.status(200).json(dataUser);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    registerUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (user) {
                return res.status(404).json("Tên tài khoản đã tồn tại!");
            }
            // Tạo salt và hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            // Tạo người dùng mới
            const newUser = new User({
                username: req.body.username,
                fullname: req.body.fullname,
                email: req.body.email,
                password: hashedPassword,
            });

            // Lưu người dùng vào cơ sở dữ liệu
            await newUser.save();

            res.status(200).json("Đăng ký thành công và mã xác thực đã được gửi vào email của bạn.");
        } catch (error) {
            console.error(error);
            res.status(500).json("Có lỗi xảy ra, vui lòng thử lại sau.");
        }
    },
    secretkeyUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json("Không tìm thấy người dùng");
            }
            if (user.isAcctived || user.code) {
                return res.status(404).json("Tài khoản đã có key bí mật hoặc đã được kích hoạt");
            }
            // Tạo mã xác thực
            const salt = await bcrypt.genSalt(10);
            const code = generateRandomString(); // Mã xác thực gốc (không mã hóa)
            const hashedCode = await bcrypt.hash(code, salt); // Mã hóa mã xác thực

            user.code = hashedCode;
            // Cấu hình Nodemailer
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.Mail_USER,
                    pass: process.env.PassMail
                }
            });

            // Tạo nội dung email
            const mailOptions = {
                from: `SOS MANAGER <${process.env.Mail_USER}>`,
                to: user.email, // Địa chỉ email người dùng
                subject: 'Chào Mừng Bạn Đến Với Ứng Dụng Quản Lý Tài Sản',
                html: `
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

                            .title {
                                font-size: 22px;
                                font-weight: 600;
                                padding: 12px 12px;
                                border-radius: 8px 8px 0 0;
                                color: #fff;
                                background-color: #247C5C;
                            }

                            .device {
                                background-color: #E8F8F1;
                            }

                            .device-title {
                                font-size: 16px;
                                line-height: 150%;
                                padding: 8px 0;
                                margin: 0px 24px;
                                color: black;
                                text-align: left;
                            }

                            .device-dt {
                                margin: 0px 24px;
                                padding: 4px 0;
                                border-radius: 8px;
                                background-color: #fff;
                            }

                            .reminder {
                                padding: 8px;
                                font-weight: 600;
                                color: #a82222;
                            }
                        </style>
                    </head>

                    <body>
                        <div id="container">
                            <div class="title">
                                TÀI KHOẢN ĐÃ ĐƯỢC PHÊ DUYỆT
                            </div>
                            <div class="device">
                                <div class="device-title">Cảm ơn bạn đã đăng ký tài khoản tại ứng dụng quản lý của chúng tôi, đây là mã xác
                                    thực đăng nhập lần đầu của bạn:</div>
                                <div class="device-dt">
                                    ${code}
                                </div>
                                <div class="reminder">
                                    Vui lòng không chia sẻ mã này đến bất kì ai. <a class="acceptKey" href="http://localhost:3000/acceptkey"> Kích hoạt tại đây</a>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
            };

            // Gửi email
            await transporter.sendMail(mailOptions);

            // Lưu user với code đã mã hóa
            await user.save();
            res.status(200).json("Chấp nhận thành công");
        } catch (error) {
            res.status(500).json(error);
        }
    }
    ,acceptkeyUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json("Không tìm thấy người dùng");
            }
            const validPassword = await bcrypt.compare(
                req.body.password, user.password
            );
            const validcode = await bcrypt.compare(
                req.body.code, user.code
            );
            if (!validPassword) {
                return res.status(404).json("Sai mật khẩu!");
            }
            if (user.isAcctived) {
                return res.status(404).json("Tài khoản đã được kích hoạt!");
            }
            if (!validcode) {
                return res.status(404).json("Sai mã khóa bí mật!");
            }

            user.isAcctived = true;
            await user.save();
            res.status(200).json("Chấp nhận thành công");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    //UPdate PASSWORD
    changePassword: async (req, res) => {
        try {
            const newPassword = req.body.passWord;
            // Tìm người dùng trong database
            const user = await User.findById(req.body.id);

            // Tạo mật khẩu mới và lưu vào database
            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedNewPassword;
            await user.save();

            res.status(200).json("Đổi mật khẩu thành công");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    //DELETE User
    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;

            // Kiểm tra xem người dùng có tồn tại và có phải là người dùng không phải admin không
            const userToDelete = await User.findById(userId);
            if (!userToDelete || userToDelete.admin) {
                return res.status(404).json("Người dùng không tồn tại hoặc không thể xóa.");
            }
            // Xóa người dùng
            await User.findByIdAndDelete(userId);

            res.status(200).json("Xóa người dùng thành công");
        } catch (error) {
            res.status(500).json(error);
        }
    },

    //ge,nerate access token
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        }, process.env.JWT_ACCESS_KEY,
            { expiresIn: "15s" }
        );
    },
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin
            }, process.env.JWT_REFRESHTOKEN_KEY,
            { expiresIn: "365d" }
        );
    },
    //Login
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json("wrong username!");
            }

            const validPassword = await bcrypt.compare(
                req.body.password, user.password
            );
            if (!validPassword) {
                return res.status(404).json("Wrong password!");
            }
            if (!user.isAcctived) {
                return res.status(403).json("Acccount not Actived!");
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokensArr.push(refreshToken);
                const { password, ...others } = user._doc;
                res.status(200).json({ ...others, accessToken, refreshToken });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
    logoutUser: async (req, res) => {
        res.clearCookie("refreshToken");
        refreshTokensArr = refreshTokensArr.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("Logged out!!!");
    },
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.body.token;
        if (!refreshToken) return res.status(401).json("you're not authenticated");
        if (!refreshToken.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESHTOKEN_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }
            refreshTokensArr = refreshTokensArr.filter((token) => token !== refreshToken);
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokensArr.push(newRefreshToken);
            res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
        })
    }
}
module.exports = authController;
