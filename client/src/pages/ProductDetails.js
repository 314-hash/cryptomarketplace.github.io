import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  Chip,
  Rating,
  TextField,
} from '@mui/material';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  // Mock product data
  const product = {
    id,
    title: 'Sample Product',
    description: 'This is a detailed description of the product.',
    price: '1.5 ETH',
    rating: 4.5,
    reviews: 128,
    seller: 'CryptoSeller123',
    category: 'Digital Products',
    image: 'https://via.placeholder.com/600x400',
    features: [
      'High-quality digital asset',
      'Instant delivery',
      'Lifetime access',
      'Support included',
    ],
  };

  const handleBuyNow = async () => {
    try {
      // TODO: Implement purchase logic with cryptocurrency
      console.log('Processing purchase...');
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2}>
            <img
              src={product.image}
              alt={product.title}
              style={{ width: '100%', height: 'auto' }}
            />
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {product.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({product.reviews} reviews)
              </Typography>
            </Box>

            <Chip label={product.category} color="primary" sx={{ mb: 2 }} />
            
            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              {product.price}
            </Typography>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Seller: {product.seller}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Features:
            </Typography>
            <Box sx={{ mb: 3 }}>
              {product.features.map((feature, index) => (
                <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                  • {feature}
                </Typography>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                InputProps={{ inputProps: { min: 1 } }}
                sx={{ width: 100, mr: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleBuyNow}
                fullWidth
              >
                Buy Now with Crypto
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
