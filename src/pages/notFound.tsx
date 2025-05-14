import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="p-10 text-center">
      <h1 className="mb-4 text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mb-6">The page you are looking for does not exist.</p>
      <Button onClick={() => navigate('/')}>Go Home</Button>
    </div>
  );
}
