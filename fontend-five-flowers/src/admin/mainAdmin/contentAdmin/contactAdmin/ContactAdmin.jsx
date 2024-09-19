import React from "react";
import { Route, Routes } from "react-router-dom";
import AllContactAdmin from "./allContactAdmin/AllContactAdmin";
import ReplyMail from "./ReplyMail/ReplyMail";

const ContactAdmin = () => {
    return (
        <div className="contact-admin-container">
            <Routes>
                <Route index element={<AllContactAdmin />} />
                {/* Thêm đường dẫn có chứa id */}
                <Route path="replymail/:id" element={<ReplyMail />} />
            </Routes>
        </div>
    );
};
export default ContactAdmin;
