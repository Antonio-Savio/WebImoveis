<h1 align="center">WebImóveis</h1>

WebImóveis is a platform where you can either find an ideal property for you, or publish your property for sale or rent. Use the filters to find apartaments and houses in your city. You can browse to the details page and reach to the owner by a WhatsApp link. Only registered users are able to access dashboard and publish sale/rent property.

## Access the application 🌍
[WebImóveis](https://webimoveis.vercel.app/)

## Desktop preview 🖥️
<video width="500" controls autoplay>
  <source src="src/assets/video-WebImoveis.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>

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
- **TypeScript**: ensures type safety, catching errors during development, improving code quality, and enhancing developer productivity.
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
3. Create a .env file in the project root and add all your Firebase configurations:
   ```bash
   VITE_API_KEY='YOUR_API_KEY_HERE'
   VITE_AUTH_DOMAIN='YOUR_AUTH_DOMAIN_HERE'
   VITE_PROJECT_ID='YOUR_PROJECT_ID_HERE'
   VITE_STORAGE_BUCKET='YOUR_STORAGE_BUCKET_HERE'
   VITE_MESSAGING_SENDER_ID='YOUR_MESSAGING_SENDER_ID_HERE'
   VITE_APP_ID='YOUR_APP_ID_HERE'
   ```

4. Run the project locally:

   ```bash
   npm run dev
   ```
5. Access the application at http://localhost:5173.

## License 📄

This project is licensed under the [MIT License](LICENSE).

You are free to use, modify, and distribute this software for personal and commercial purposes, as long as the original license and copyright notice are included. There is no warranty for the code provided, and the author is not liable for any issues arising from the use of this software.