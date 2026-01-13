import NavBar from "../components/NavBar"; // Prilagodite putanju u zavisnosti od strukture vašeg projekta
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // Potrebno za Link komponentu

test("Dark mode button toggles dark mode class on body", () => {
    render(
        <BrowserRouter>
            <NavBar imageSrcPath="path/to/logo.png" navItems={[{ name: "Gallery", path: "/gallery" }]} />
        </BrowserRouter>
    );

    const darkModeButton = screen.getByText("Change to Dark Mode");
    
    // Proveravamo početno stanje
    expect(document.body).toHaveClass("light-mode");
    expect(document.body).not.toHaveClass("dark-mode");

    // Klik na dugme za prebacivanje u tamni režim
    fireEvent.click(darkModeButton);

    // Proveravamo stanje nakon klika
    expect(darkModeButton).toHaveTextContent("Change to Light Mode");
    expect(document.body).toHaveClass("dark-mode");
    expect(document.body).not.toHaveClass("light-mode");

    // Klik ponovo da se vratimo na svetli režim
    fireEvent.click(darkModeButton);

    // Proveravamo stanje nakon drugog klika
    expect(darkModeButton).toHaveTextContent("Change to Dark Mode");
    expect(document.body).toHaveClass("light-mode");
    expect(document.body).not.toHaveClass("dark-mode");
});