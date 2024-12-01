import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Skeleton,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SearchAndFilter from '../components/SearchAndFilter';

// Temporary mock data - replace with API call
const mockProducts = [
  {
    id: 1,
    title: 'Digital Art Collection #1',
    description: 'A unique collection of digital art pieces',
    price: 0.5,
    image: 'https://via.placeholder.com/300',
    category: 'Digital Art',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: 'Vintage Watch',
    description: 'Rare vintage watch in excellent condition',
    price: 2.5,
    image: 'https://via.placeholder.com/300',
    category: 'Physical Items',
    createdAt: new Date('2024-01-14'),
  },
  // Add more mock products...
];

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    priceRange: [0, 10],
    sortBy: 'newest',
  });

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFilters(term, activeFilters);
  };

  const handleFilter = (filters) => {
    setActiveFilters(filters);
    applyFilters(searchTerm, filters);
  };

  const applyFilters = (term, filters) => {
    let filtered = [...products];

    // Apply search term
    if (term) {
      const searchLower = term.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1]
    );

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const ProductCard = ({ product }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {product.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2,
          }}
        >
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={product.category}
            size="small"
            sx={{ backgroundColor: theme.palette.primary.light }}
          />
          <Typography variant="h6" color="primary">
            {product.price} ETH
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="rectangular" width={60} height={24} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Marketplace
      </Typography>
      
      <SearchAndFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
      />

      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(6)).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <LoadingSkeleton />
              </Grid>
            ))
          : filteredProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <ProductCard product={product} />
              </Grid>
            ))}
        
        {!loading && filteredProducts.length === 0 && (
          <Box
            sx={{
              width: '100%',
              py: 8,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No products found matching your criteria
            </Typography>
          </Box>
        )}
      </Grid>
    </Container>
  );
};

export default Products;
