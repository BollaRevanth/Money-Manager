import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";

const ContactUs = () => {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <LandingNavbar />
            <main className="flex-1 pt-24">
                <div className="container mx-auto px-6 py-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Have questions? I'd love to hear from you. Reach out to me at <a href="mailto:revanthbolla2948@gmail.com" className="text-purple-700 font-medium">revanthbolla2948@gmail.com</a>.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default ContactUs;
