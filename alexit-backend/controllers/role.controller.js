import Role from "../models/Role.js";
import { CreateError } from "../middlewares/error.js";
import { CreateSuccess } from "../middlewares/success.js";



export const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.find({});
        if (roles) {
            return next(CreateSuccess(200, "All roles fetched successfully.", roles));
        } else {
            return next(CreateSuccess(400, "Failed to fetch all roles..."));
        }
    } catch (error) {
        return next(CreateError(500, "Error catched in fetching all roles..."));
    }
};


export const createRole = async (req, res, next) => {
    try {
        if (req.body) {
            const newRole = new Role(req.body);
            await newRole.save();
            res.send();
        } else {
            res.status(400).send("Failed to create role...")
        }
    } catch (error) {
        res.status(500).send("Error catched in role creating...");
    }
};


export const deleteRole = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);
        if (role) {
            await Role.findByIdAndDelete(req.params.id);
            res.send();
        } else {
            res.status(400).send("Role to update not found");
        }
    } catch (error) {
        res.status(500).send("Error catched in role updating");
    }
};
