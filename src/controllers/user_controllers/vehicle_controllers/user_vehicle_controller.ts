import {NextFunction, Request, Response} from 'express';
import prisma from "../../../config/database";
import {users} from "@prisma/client";
import ValidationController from "../../security_controllers/validation_controller";

export default class UserVehicleController {
    public static async fetchAll(req: Request, res: Response, next: NextFunction) {
        try {
            //Check if uid is present in the request headers
            const uid: number = Number(req.headers.uid);

            if (!uid) {
                return res.status(400).json({
                    status: 'error',
                    data: null,
                    message: 'Invalid or missing uid',
                });
            }

            //Check if user exists
            const user: users | null = await prisma.users.findUnique({
                where: {
                    id: uid
                }
            });

            if (user == null) {
                return res.status(400).json({
                    status: 'error',
                    data: null,
                    message: "User not found"
                });
            }

            const userVehicles = await prisma.vehicles.findMany({});

            return res.status(200).json({
                status: 'success',
                data: {
                    vehicles: userVehicles,
                },
                message: 'User vehicles fetched successfully',
            });
        } catch (e) {
            next(e);
        }
    }

    public static async add(req: Request, res: Response, next: NextFunction) {
        const uid: number = Number(req.headers.uid);

        if (!uid) {
            return res.status(400).json({
                status: 'error',
                data: null,
                message: 'Invalid or missing uid',
            });
        }

        const user = await prisma.users.findUnique({
            where: {
                id: uid
            }
        });

        if (user == null) {
            return res.status(400).json({
                status: 'error',
                data: null,
                message: "User not found"
            });
        }


        //Check if number is present and validate it
        if (!req.body.number) {
            return res.status(400).json({
                status: 'error',
                data: null,
                message: 'Invalid or missing vehicle number',
            });
        }

        const number = req.body.number;

        if (!ValidationController.validateVehicleNumber(number)) {
            return res.status(400).json({
                status: 'error',
                data: null,
                message: 'Invalid vehicle number',
            });
        }


        //Check if vehicle number is already registered
        const vehicleExists = await prisma.vehicles.findUnique({
            where: {
                number: number,
            }
        });

        if (vehicleExists) {
            return res.status(400).json({
                status: 'error',
                data: null,
                message: 'Vehicle already registered',
            });
        }

        //Update the req.body.ownerId to be the uid.
        req.body.ownerId = uid;

        const vehicle = await prisma.vehicles.create({data: req.body});

        return res.status(200).json({
            status: 'success',
            data: {
                vehicle: vehicle,
            },
            message: 'Vehicle added successfully',
        });
    }

    public static async update(req: Request, res: Response) {
        const uid = req.headers.uid;

        if (!uid) {
            return res.status(400).json({
                status: 'error',
                data: null,
                message: 'Invalid or missing uid',
            });
        }
    }
}