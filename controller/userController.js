const { StatusCodes } = require("http-status-codes");
const User = require("../models/Usermodel");
const CustomError = require("../middleware/CustomError");
const sendToken = require("../utils/jwtHelper");
const { sendMail } = require("../utils/sendEmail");
const crypto = require("crypto");

// Register User
exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "Sample",
      url: "Sample URL",
    },
  });
  user.password = undefined;
  sendToken(user, StatusCodes.CREATED, res);
};

// Login User
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError(
      "Please Enter an email and password",
      StatusCodes.BAD_REQUEST
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new CustomError(
      "Provided Invalid email or Password",
      StatusCodes.UNAUTHORIZED
    );
  }

  // compare password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new CustomError(
      "Invalid email or Password",
      StatusCodes.UNAUTHORIZED
    );
  }
  user.password = undefined;
  sendToken(user, StatusCodes.OK, res);
};

// Logout User
exports.logoutUser = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Logged Out Successfully" });
};

// forgot Password
exports.forgotPasswords = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new CustomError("User not Found", StatusCodes.NOT_FOUND);
  }

  // get resetPassword Token
  const resetToken = user.generateResetToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is : ${resetPasswordURL} \n\n If you have not requested this mail then please ignore it.`;

  try {
    await sendMail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Message sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new CustomError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new CustomError(
      "Reset Password token is invalid or is expired",
      StatusCodes.NOT_FOUND
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    throw new CustomError("Password doesn't match", StatusCodes.BAD_REQUEST);
  }
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  sendToken(user, StatusCodes.OK, res);
};

// Update Password
exports.updatePassword = async (req, res) => {
  if (!req.body.oldPassword) {
    throw new CustomError(
      "Please provide old Password",
      StatusCodes.BAD_REQUEST
    );
  }
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatch) {
    throw new CustomError(
      "Old Password doesn't match",
      StatusCodes.BAD_REQUEST
    );
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    throw new CustomError("Passwords doesn't match", StatusCodes.BAD_REQUEST);
  }
  user.password = req.body.newPassword;

  await user.save();
  user.password = undefined;
  sendToken(user, StatusCodes.OK, res);
};

// Update Profile
exports.updateProfile = async (req, res) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };
  // We will add cloudinary later
  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(StatusCodes.OK).json({
    success: true,
  });
};

// Get user detail
exports.getUserDetails = async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
};

// Get All users --Admin
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(StatusCodes.OK).json({
    success: true,
    users,
  });
};

// Get a User Detail --Admin
exports.getOneUserDetail = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new CustomError(`User doesn't exists with ID ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({
    success: true,
    user,
  });
};

// Update User Role --Admin
exports.updateUserRole = async (req, res) => {
  const newData = {
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    throw new CustomError(
      `No user Found with ID ${req.params.id}`,
      StatusCodes.NOT_FOUND
    );
  }

  res.status(StatusCodes.OK).json({
    success: true,
  });
};

// Delete a User --Admin
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new CustomError(
      `User Not Found with ID ${req.params.id}`,
      StatusCodes.NOT_FOUND
    );
  }

  // We will remove cloudinary
  res.status(StatusCodes.OK).json({
    success: true,
    message: "User Deleted Successfully",
  });
};
