import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <main>
                <Outlet /> {/* This renders the page content */}
            </main>
        </>
    );
};

export default MainLayout;
