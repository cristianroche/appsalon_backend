import Service from "../models/Service.js";
import { handleNotFound, validateObjectId } from "../utils/index.js";

const createService = async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    res.status(400).json({ message: "Name and price are required" });
    return;
  }

  const service = { name, price };

  try {
    const newService = await Service(service);
    await newService.save();
  } catch (error) {
    res.status(500).send("Failed to create service");
    console.error(error);
  }
  res.status(201).json({ message: "Service created successfully" });
};

const updateService = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  if (validateObjectId(id, res)) return;

  const service = await Service.findById(id);

  if (!service) {
    return handleNotFound("Service not found", res);
  }

  service.name = name || service.name;
  service.price = price || service.price;

  try {
    await service.save();
  } catch (error) {
    res.status(500).json({ message: "Failed to update service" });
  }

  res.status(200).json({ message: "Service updated successfully" });
};

const deleteService = async (req, res) => {
  const { id } = req.params;

  if (validateObjectId(id, res)) return;

  const service = await Service.findById(id);

  if (!service) {
    return handleNotFound("Service not found", res);
  }

  try {
    await service.deleteOne();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service" });
  }

  res.status(200).json({ message: "Service deleted successfully" });
};

const getServiceById = async (req, res) => {
  const { id } = req.params;

  if (validateObjectId(id, res)) return;

  const service = await Service.findById(id);

  if (!service) {
    return handleNotFound("Service not found", res);
  }

  res.json(service);
};

const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

export {
  getServiceById,
  getServices,
  createService,
  updateService,
  deleteService,
};
