import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Container, Grid,Card, CardContent, CardMedia, Typography, Button, TextField, Box,Chip,Pagination,
  Stack,
  ToggleButton, 
  ToggleButtonGroup,
  IconButton
} from '@mui/material';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import api from '../utils/axios';
import ViewModuleIcon from '@mui/icons-material/ViewModule'; 
import ViewListIcon from '@mui/icons-material/ViewList'; 

const Products = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [view, setView] = useState('grid');

  const handleViewChange = (event, nextView) => {
    
    if (nextView !== null) {
      setView(nextView);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (id && products.length > 0) {
      const product = products.find(p => p.id === parseInt(id));
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }
  }, [id, products]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
    setCurrentPage(1);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/posts');
      const mockProducts = response.data.slice(0, 24).map(post => ({
        id: post.id,
        title: post.title,
        price: Math.floor(Math.random() * 500) + 20,
        category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
        image: `https://picsum.photos/300/200?random=${post.id}`,
        description: post.body
      }));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleBackToProducts = () => {
    navigate('/products');
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Loading products...
        </Typography>
      </Container>
    );
  }

  if (selectedProduct) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={handleBackToProducts} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4">
              Product Details
            </Typography>
          </Box>

          <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            <CardMedia
              component="img"
              sx={{ 
                width: { xs: '100%', md: 400 }, 
                height: { xs: 300, md: 400 },
                objectFit: 'cover'
              }}
              image={selectedProduct.image}
              alt={selectedProduct.title}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                <Typography variant="h4" gutterBottom>
                  {selectedProduct.title}
                </Typography>
                
                <Chip 
                  label={selectedProduct.category} 
                  size="medium" 
                  sx={{ mb: 2 }} 
                />
                
                <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                  ${selectedProduct.price}
                </Typography>
                
                <Typography variant="body1" paragraph>
                  {selectedProduct.description}
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={() => addToCart(selectedProduct)}
                  sx={{ mt: 2 }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Box>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Products ({filteredProducts.length} items)
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            label="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, mr: 2 }}
          />
          
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view mode"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {view === 'grid' ? (
          <Grid container spacing={3}>
            {currentProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onClick={() => handleProductClick(product.id)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.title.length > 50 
                        ? `${product.title.substring(0, 50)}...` 
                        : product.title
                      }
                    </Typography>
                    
                    <Chip 
                      label={product.category} 
                      size="small" 
                      sx={{ mb: 1 }} 
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description
                      }
                    </Typography>
                    
                    <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                      ${product.price}
                    </Typography>
                    
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ShoppingCart />}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack spacing={2}>
            {currentProducts.map((product) => (
              <Card 
                key={product.id} 
                sx={{ 
                  display: 'flex', 
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 2,
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={() => handleProductClick(product.id)}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1 }}
                  image={product.image}
                  alt={product.title}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: 2 }}>
                  <CardContent sx={{ flex: '1 0 auto', p: 0 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.title}
                    </Typography>
                    
                    <Chip 
                      label={product.category} 
                      size="small" 
                      sx={{ mb: 1 }} 
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.description}
                    </Typography>
                    
                    <Typography variant="h6" color="primary">
                      ${product.price}
                    </Typography>
                  </CardContent>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        )}

        {totalPages > 1 && (
          <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
            <Typography variant="body2" color="text.secondary">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
            </Typography>
          </Stack>
        )}

        {filteredProducts.length === 0 && (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No products found
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Products;