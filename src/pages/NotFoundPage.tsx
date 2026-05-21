import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="page-wrap">
        <div className="not-found">
          <div className="not-found__code">404</div>
          <h1 className="not-found__title">Page not found</h1>
          <p className="not-found__body">This page does not exist or has been moved.</p>
          <Button href="/" size="lg">Back to home</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
