import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Chip,
  Typography,
  Popover,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Slider,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

const categories = [
  'Digital Art',
  'Physical Items',
  'Collectibles',
  'Gaming',
  'Music',
  'Domain Names',
  'Virtual Real Estate',
  'Other',
];

const SearchAndFilter = ({ onSearch, onFilter }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [sortBy, setSortBy] = useState('newest');
  const [activeFilters, setActiveFilters] = useState([]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryToggle = (category) => {
    const currentIndex = selectedCategories.indexOf(category);
    const newCategories = [...selectedCategories];

    if (currentIndex === -1) {
      newCategories.push(category);
    } else {
      newCategories.splice(currentIndex, 1);
    }

    setSelectedCategories(newCategories);
    updateActiveFilters(newCategories, priceRange, sortBy);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    updateActiveFilters(selectedCategories, newValue, sortBy);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    updateActiveFilters(selectedCategories, priceRange, value);
  };

  const updateActiveFilters = (categories, price, sort) => {
    const filters = [];
    
    if (categories.length > 0) {
      filters.push(...categories.map(cat => ({ type: 'category', value: cat })));
    }
    
    if (price[0] !== 0 || price[1] !== 10) {
      filters.push({ type: 'price', value: `${price[0]} - ${price[1]} ETH` });
    }
    
    if (sort !== 'newest') {
      filters.push({ type: 'sort', value: sort });
    }

    setActiveFilters(filters);
    onFilter({ categories, priceRange: price, sortBy: sort });
  };

  const handleRemoveFilter = (filter) => {
    if (filter.type === 'category') {
      const newCategories = selectedCategories.filter(cat => cat !== filter.value);
      setSelectedCategories(newCategories);
      updateActiveFilters(newCategories, priceRange, sortBy);
    } else if (filter.type === 'price') {
      setPriceRange([0, 10]);
      updateActiveFilters(selectedCategories, [0, 10], sortBy);
    } else if (filter.type === 'sort') {
      setSortBy('newest');
      updateActiveFilters(selectedCategories, priceRange, 'newest');
    }
  };

  const handleClearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10]);
    setSortBy('newest');
    setActiveFilters([]);
    onFilter({ categories: [], priceRange: [0, 10], sortBy: 'newest' });
  };

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'background.paper',
            },
          }}
        />
        <Button
          variant={anchorEl ? 'contained' : 'outlined'}
          onClick={handleFilterClick}
          startIcon={<FilterIcon />}
          sx={{ minWidth: 100 }}
        >
          Filter
        </Button>
      </Box>

      {activeFilters.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {activeFilters.map((filter, index) => (
            <Chip
              key={index}
              label={filter.value}
              onDelete={() => handleRemoveFilter(filter)}
              variant="outlined"
            />
          ))}
          <Button
            size="small"
            onClick={handleClearAllFilters}
            sx={{ ml: 1 }}
          >
            Clear All
          </Button>
        </Box>
      )}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ width: isMobile ? '100vw' : 300, p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Categories</Typography>
          <List dense>
            {categories.map((category) => (
              <ListItem
                key={category}
                dense
                button
                onClick={() => handleCategoryToggle(category)}
              >
                <Checkbox
                  edge="start"
                  checked={selectedCategories.indexOf(category) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText primary={category} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Price Range (ETH)
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.1}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {priceRange[0]} ETH
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {priceRange[1]} ETH
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Sort By</Typography>
          <List dense>
            {[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'price_high', label: 'Price: High to Low' },
              { value: 'price_low', label: 'Price: Low to High' },
            ].map((option) => (
              <ListItem
                key={option.value}
                dense
                button
                onClick={() => handleSortChange(option.value)}
                selected={sortBy === option.value}
              >
                <ListItemText primary={option.label} />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleFilterClose}>
              Apply Filters
            </Button>
          </Box>
        </Paper>
      </Popover>
    </Box>
  );
};

export default SearchAndFilter;
