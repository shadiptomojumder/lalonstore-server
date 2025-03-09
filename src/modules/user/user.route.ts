import auth from "@/middlewares/auth";
import { UserController } from "@/user/user.controller";
import express, { Router } from "express";
import { ENUM_USER_ROLE } from "../../enums/user";
import { upload } from "@/middlewares/multer.middleware";

const router = express.Router();

// Route to get all users
router.get(
  "/all",
  // auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.USER),
  UserController.getAllUser
);


// Route to get a user by ID
router.get("/:id", UserController.getOneUser);

// Route to Update an User
router.patch("/:userId",upload.single("avatar"), UserController.updateUser);

export const UserRoutes:Router = router;
