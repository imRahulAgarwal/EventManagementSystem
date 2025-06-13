import express from "express";

const panelRouter = express.Router();

panelRouter.post("/login");
panelRouter.post("/forgot-password");
panelRouter.post("/reset-password");

panelRouter.get("/");
panelRouter.post("/change-password");

panelRouter.get("/event-types/");
panelRouter.get("/event-types/:eventTypeId");
panelRouter.post("/event-types");
panelRouter.put("/event-types/:eventTypeId");
panelRouter.delete("/event-types/:eventTypeId");

panelRouter.get("/events/");
panelRouter.get("/events/:eventTypeId");
panelRouter.post("/events");
panelRouter.put("/events/:eventTypeId");
panelRouter.delete("/events/:eventTypeId");

panelRouter.get("/event/ticket-types/");
panelRouter.get("/event/ticket-types/:ticketTypeId");
panelRouter.post("/event/ticket-types");
panelRouter.put("/event/ticket-types/:ticketTypeId");
panelRouter.delete("/event/ticket-types/:ticketTypeId");

// MORE ROUTES RELATED TO
// 1. Event Tickets generated in batches
// 2. Event Ticket Listing

panelRouter.get("/permissions");

panelRouter.get("/roles/");
panelRouter.get("/roles/:roleId");
panelRouter.post("/roles");
panelRouter.put("/roles/:roleId");
panelRouter.delete("/roles/:roleId");

panelRouter.get("/panel-users/");
panelRouter.get("/panel-users/:panelUserId");
panelRouter.post("/panel-users");
panelRouter.put("/panel-users/:panelUserId");
panelRouter.delete("/panel-users/:panelUserId");

panelRouter.get("/users/");
panelRouter.get("/users/:userId");
panelRouter.post("/users");
panelRouter.put("/users/:userId");
panelRouter.delete("/users/:userId");

panelRouter.get("/carts/");
panelRouter.get("/carts/:cartId");

panelRouter.get("/orders/");
panelRouter.get("/orders/:orderId");

panelRouter.get("/transactions/");
panelRouter.get("/transactions/:transactionId");

panelRouter.get("/logs");
panelRouter.get("/logs/:logId");

panelRouter.post("/reset-panel-user-password");

panelRouter.post("/logout");

export default panelRouter;
