import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;