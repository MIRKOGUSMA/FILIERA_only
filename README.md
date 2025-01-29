# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---

# App-Azienda - Logic Overview

This document describes the logic to be integrated into the **"App-Azienda"**, which is currently not functioning as expected.

## Summary  
The explanation below outlines the key functionalities:  

- **"To Do" Button**: Allows users to input the number of items that need to be processed.  
- **"Show Supply Chain" Button**: Toggles the visibility of the table containing daily records.  
  - In the **"App-Azienda"**, this functionality should be executed by clicking on the cell in the **"Supply Chain"** column corresponding to the specific request.  
- **"Filagne" and "Filiera" Columns**: Clicking on these columns scrolls down to the total values section.  
  - The summed totals are subtracted from the total number of "To Do" items, and the result is displayed in the **"Remaining"** field.  

## Expected Implementation in **"App-Azienda"**  
In the **"App-Azienda"**, the following equivalences should be applied:  

- **"To Do"** → **"Quantity"**  
- **"Processed"** → **"COMPLETED"**  
- **"Remaining"** → **"REMAINING"**  

This logic must be correctly implemented to ensure the proper functionality of the application.
