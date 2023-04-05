import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Col, Dropdown, DropdownButton, Form, Row } from "react-bootstrap";
import { FaHashtag } from "react-icons/fa";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import InputEmoji from 'react-input-emoji'
import "./MessageForm.css";
import { GoKebabVertical } from "react-icons/go";
import moment from "moment/moment";

function MessageForm() {
    const [message, setMessage] = useState("");
    const user = useSelector((state) => state.user);
    const { socket, currentRoom, setMessages, messages, privateMemberMsg } = useContext(AppContext);
    const messageEndRef = useRef(null);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function getFormattedDate() {
        const date = new Date();
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();

        month = month.length > 1 ? month : "0" + month;
        let day = date.getDate().toString();

        day = day.length > 1 ? day : "0" + day;

        return month + "/" + day + "/" + year;
    }

    // function handleSubmit(e) {
    //     e.preventDefault();
    // }

    function scrollToBottom() {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const todayDate = getFormattedDate();

    socket.off("room-messages").on("room-messages", (roomMessages) => {
        setMessages(roomMessages);
    });

    function handleSubmit(e) {
        if (!message) return;
        const today = new Date();
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        const time = today.getHours() + ":" + minutes;
        const roomId = currentRoom;
        socket.emit("message-room", roomId, message, user, time, todayDate);
        setMessage("");
    }

    function handleDelete(id) {
        const roomId = currentRoom;
        console.log("id", id);
        socket.emit("delete-message", id, roomId);
    }

    console.log("user", user);

    return (
        <div className="mesaage-wrapper">
            {user && !privateMemberMsg?._id &&
                <div className="conversation-info d-flex align-items-center">
                    <FaHashtag className="member-status-img" />
                    <div className="">You are in the {currentRoom} room</div>
                </div>
            }
            {user && privateMemberMsg?._id && (
                <>
                    <div className="conversation-info d-flex align-items-center">
                        <img src={privateMemberMsg.picture} className="conversation-profile-pic d-block" />
                        <div className="d-block font-weight-bold">{privateMemberMsg.name} </div>
                    </div>
                </>
            )}
            <div className="messages-output">
                {!user && <div className="alert alert-danger">Please login</div>}
                {user &&
                    messages.map(({ _id: date, messagesByDate }, idx) => (
                        <div key={idx}>
                            <p className="text-center message-date-indicator">{moment().format('DD/MM/YYYY') === moment(date).format('DD/MM/YYYY') ? 'Today' : moment().subtract(1, 'd') ? 'Yesterday' : date}</p>
                            {messagesByDate?.map(({ content, time, from: sender, _id }, msgIdx) => (
                                <div className={sender?.email == user?.email ? "message" : "incoming-message"} key={msgIdx}>
                                    <div className="message-inner">
                                        {
                                            user && !privateMemberMsg?._id &&
                                            <>
                                                <div className="d-flex align-items-center justify-content-between mb-1">
                                                    <div className="d-flex align-items-center">
                                                        <img src={sender.picture} style={{ width: 35, height: 35, objectFit: "cover", borderRadius: "50%", marginRight: 10 }} />
                                                        <p className="message-sender mb-0">{sender._id == user?._id ? "You" : sender.name}</p>
                                                    </div>
                                                    <div className="btn-group dropup">
                                                        {/* <button className="buttonmenu dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button> */}
                                                        {
                                                            sender._id == user?._id &&
                                                            <DropdownButton
                                                                as={ButtonGroup}
                                                                className="buttonmenu"
                                                                id={`dropdown-button-drop`}
                                                                drop='up'
                                                                title={<GoKebabVertical />}
                                                            >
                                                                <Dropdown.Item onClick={() => handleDelete(_id)} eventKey="1">Delete</Dropdown.Item>
                                                            </DropdownButton>
                                                        }
                                                    </div>
                                                </div>
                                            </>
                                        }
                                        <p className="message-content mb-1">{content}</p>
                                        <p className="message-timestamp-left mb-0 text-end font-weight-bold">{time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                <div ref={messageEndRef} />
            </div>
            <Form className="form-data">
                <Row className="align-items-center">
                    <Col md={12}>
                        {/* <Form.Group>
                            <Form.Control type="text" placeholder="Your message" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)}></Form.Control>
                        </Form.Group> */}
                        <InputEmoji
                            value={message}
                            onChange={setMessage}
                            disabled={!user}
                            onEnter={handleSubmit}
                            placeholder="Type a message"
                        />
                    </Col>
                    <Col md={1} style={{ position: "absolute", right: "22px" }}>
                        <Button type="button" onClick={handleSubmit} style={{ width: "100%", backgroundColor: "#64748b", border: '0', borderRadius: "25px", backgroundImage: "radial-gradient(circle farthest-corner at 18.5% 28.5%, rgba(4, 71, 88, 1) 0%, rgba(12, 141, 190, 1) 90%)" }} disabled={!user}>
                            <i className="fas fa-paper-plane"></i>
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div >
    );
}

export default MessageForm;
