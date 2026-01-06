import NavBar from "../components/NavBar"; 
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; 

test("If NavBar is showing Gallery", () => {
    render(
      <BrowserRouter>
        <NavBar imageSrcPath="path/to/logo.png" navItems={[{ name: "Gallery", path: "/gallery" }]} />
      </BrowserRouter>
    );

    const message = screen.queryByText("Gallery");
    expect(message).toBeVisible();
});


