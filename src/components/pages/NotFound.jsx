import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <ApperIcon name="AlertTriangle" size={64} className="text-accent" />
        </div>
        <h1 className="text-4xl font-display text-primary">Page Not Found</h1>
        <p className="text-lg text-gray-600">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;