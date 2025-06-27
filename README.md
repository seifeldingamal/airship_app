# Airship Design Calculator

A modern web application for designing airships using the Gertler 4621 Shape Model. This tool allows you to interactively adjust design parameters, visualize the airship in 3D, and view computed results such as volume, surface area, and center of buoyancy.

## Features

-   **Interactive Sliders:** Adjust key design parameters (length, diameter, L/D ratio, etc.) with instant feedback.
-   **3D Visualization:** Real-time 3D rendering of the airship envelope.
-   **Pattern & Shape Graphs:** Visualize the airship's cross-section and pattern development.
-   **Results Panel:** View computed properties like volume, surface area, and performance metrics.
-   **Accessible UI:** Built with Material UI for a consistent and accessible experience.
-   **Credits & License Modal:** View contributors and license information.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or newer recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/yourusername/airship_app.git
    cd airship_app
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Start the development server:**

    ```sh
    npm run dev
    ```

4. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173)

## Usage

-   Use the sliders in the **Design Parameters** panel to adjust airship properties.
-   The **3D View** updates in real time as you change parameters.
-   The **Results Panel** displays calculated values for your current design.
-   Click **Credits & License** in the footer for contributor and license information.

## Project Structure

```
src/
  components/         # Reusable UI components
  features/
    airship/          # Airship logic, 3D view, graph, store
    view/             # Panels, results, etc
  models/             # Data models and types
  assets/             # Static assets (textures, images)
  App.tsx             # Main app layout
  index.tsx           # Entry point
```

## Accessibility

-   Uses Material UI components for keyboard and screen reader accessibility.
-   Modals and dialogs are focus-managed and ARIA-compliant.

## License

This project is licensed under the [GNU General Public License](https://www.gnu.org/licenses/gpl-3.0.html).

## Credits

-   Based on the Gertler 4621 Shape Model.
-   Contributors: Johannes Eissing, Martin Zobel, and others (see Credits in app footer).

---

**Enjoy designing your airship!**
