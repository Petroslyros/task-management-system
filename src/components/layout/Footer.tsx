const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-white font-bold mb-4">TaskFlow</h3>
                        <p className="text-sm">Modern team collaboration for classroom projects.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Features</h4>
                        <ul className="text-sm space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Projects</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tasks</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Collaboration</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Info</h4>
                        <ul className="text-sm space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <hr className="border-gray-700 mb-8" />
                <div className="text-center text-sm">
                    <p>&copy; {currentYear} TaskFlow. Built for classroom collaboration. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;