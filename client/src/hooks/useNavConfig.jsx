import SvgColor from '../components/svg-color';
import { useAuth } from '../context/AuthContext';

// Helper function to create an icon component
const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const useNavConfig = () => {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    // Admin users get only the dashboard option
    return [
      {
        title: 'dashboard',
        path: '/dashboard/app',
        icon: icon('ic_analytics'),
      },
    ];
  } else {
    // Non-admin users get the full set of options
    return [
      {
        title: 'dashboard',
        path: '/dashboard/app',
        icon: icon('ic_analytics'),
      },
      {
        title: 'user',
        path: '/dashboard/user',
        icon: icon('ic_user'),
      },
      {
        title: 'product',
        path: '/dashboard/products',
        icon: icon('ic_cart'),
      },
      {
        title: 'blog',
        path: '/dashboard/blog',
        icon: icon('ic_blog'),
      },
      {
        title:'record calories',
        path:"/dashboard/RecordCalories",
        icon: icon('ic_user'),
      },
    ];
  }
};

export default useNavConfig;
