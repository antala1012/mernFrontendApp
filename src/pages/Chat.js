import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import MessageForm from "../components/MessageForm";

function Chat() {
    return (
        <div className="bg-main">
            <div className="m-0 d-flex align-items-center gap-4" style={{ width: "100%" }}>
                <div md={3} className="bgSidebar" style={{ width: '20%' }}>
                    <Sidebar />
                </div>
                <div md={9} className="messageBg m-0" style={{ width: '79%' }}>
                    <MessageForm />
                </div>
            </div>
        </div>
    );
}

export default Chat;
