<h1 align="center">WebImóveis</h1>

WebImóveis is a platform where you can either find an ideal property for you, or publish your property for sale or rent. Use the filters to find apartaments and houses in your city. You can browse to the details page and reach to the owner by a WhatsApp link. Only registered users are able to access dashboard and publish sale/rent property.

## Access the application 🌍
[WebImóveis](https://webimoveis.vercel.app/)

## Desktop preview 🖥️
<img src="./src/assets/WebImoveis-gif.gif" alt="Preview on desktop version"/>

## Mobile preview 📱
<img width="300px" src="./src/assets/mobile-version-webimoveis.gif" alt="Preview on mobile version"/>

## Functionalities ✅
### General Features:
- Properties on the home page are sorted by the most recently created.
- The home page includes a city search input and filters such as:
  - Rent/Sale radio input.
  - Number of rooms, bathrooms, and car spaces.
  - Minimum and maximum price input.
- Users can filter properties by city simultaneously with only one other filter, such as:
  - City and rent/sale mode (e.g., São Paulo + Rent).
  - City and number of rooms (e.g., São Paulo + 3+ Rooms).
- Each property has a details page with:
  - A slider displaying property images.
  - A **WhatsApp contact link** to reach the owner.

### User Features:
- **Toast Notifications**:
  - Appear after user actions like logging in, signing up, or registering a property.
- **Header Personalization**:
  - The logged user's name and email are displayed in the header on every page.

### Dashboard (For Registered Users Only):
- Users can publish properties for sale or rent.
- Users can delete properties they've registered.

### Register Property Page:
- Inputs like price, IPTU, and condominium have:
  - Currency masks (e.g., "200,00").
  - Validation to accept only numbers.
- The phone input has a mask with the pattern `(xx) xxxxx-xxxx`, accepting only numbers.
- Users can upload and delete images before registering a property.
- At least one image is required for registration, and the supported formats are JPG and PNG.

## Used Technologies ⚙️
- **React JS**: to build the interface.
- **Firebase**: *Authentication* to sign in and sign up users. *Storage* to store the properties images. *Firestore* as the app database.
- **Tailwind CSS**: create a pixel-perfect styling.
- **Context API**: allowing auth data sharing between components without explicit passing of props, and facilitating global state management.
- **React-router-dom**: handle navigation between pages, route creation and rendering specific components for each route.
- **Swiper**: used for presentation in the form of slides in a modern, stylized and easy to implement way.
- **react-hook-form with zod**: to create multiple inputs without React States, and implement validations.
- **react-hot-toast**: displays error/success messages.

## How to Run the Project
### Requirements 🚀
- Node.js installed
- npm ou yarn package manager

### Steps
1. Clone the repository:

   ```bash
   git clone https://github.com/Antonio-Savio/WebImoveis.git
   ```
2. Install dependencies:

   ```bash
   cd WebImoveis
   npm install
   ```
3. Run the project locally:

   ```bash
   npm run dev
   ```
4. Access the application at http://localhost:5173.
