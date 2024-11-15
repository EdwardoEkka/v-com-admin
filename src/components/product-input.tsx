import React, { useState } from "react";
import { database } from "../firebase";
import { ref, push, set } from "firebase/database";
import {
  TextField,
  Button,
  Container,
  Select,
  MenuItem,
  CardMedia,
  FormControl,
  Stack,
  Box,
  Modal,
  Typography
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import { Product } from "../types";

const AdminProductForm: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    images: [],
    price: { price: 0, currency: "USD" },
    stock: { stock: 0, stockStatus: "in stock" },
    category: { category: "", subCategory: [], tags: [] },
  });
  const [imageUrl, setImageUrl] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      price: { ...prevProduct.price, [name]: Number(value) || value },
    }));
  };

  const handleStockChange = (
    e: React.ChangeEvent<{ value: unknown; name?: string }>
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      stock: { ...prevProduct.stock, [name || ""]: value as string },
    }));
  };

  const handleAddImage = () => {
    if (imageUrl) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        images: [...prevProduct.images, imageUrl],
      }));
      setImageUrl("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !product.name ||
      !product.description ||
      product.price.price <= 0 ||
      product.stock.stock <= 0
    ) {
      alert("Please fill out all required fields with valid values.");
      return;
    }

    const productRef = ref(database, "products");
    const newProductRef = push(productRef);
    await set(newProductRef, product);
    alert("Product added successfully!");
    setProduct({
      name: "",
      description: "",
      images: [],
      price: { price: 0, currency: "USD" },
      stock: { stock: 0, stockStatus: "in stock" },
      category: { category: "", subCategory: [], tags: [] },
    });
  };

  const handleRemoveImage = (imgUrl: string) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: prevProduct.images.filter((image) => image !== imgUrl),
    }));
  };
  

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 5,
        p: 3,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Stack direction="row" gap="32px">
          <Stack flexGrow={1} width="50%">
            <TextField
              label="Product Name"
              name="name"
              value={product.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={product.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              required
            />
            <TextField
              label="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button onClick={handleAddImage} variant="outlined" sx={{ mb: 2 }}>
              Add Image
            </Button>
            <Stack direction="row" >
              <ImagePagination product={product} removeImage={handleRemoveImage}/>
            </Stack>
          </Stack>
          <Stack flexGrow={1} width="50%">
            <Stack direction="row" gap="16px">
              <TextField
                label="Price"
                name="price"
                value={product.price.price}
                onChange={handlePriceChange}
                fullWidth
                type="number"
                margin="normal"
                inputProps={{ min: "0" }}
                required
              />
              <TextField
                label="Discounted Price"
                name="discountedPrice"
                value={product.price.discountedPrice || ""}
                onChange={handlePriceChange}
                fullWidth
                type="number"
                margin="normal"
                inputProps={{ min: "0" }}
              />
              <TextField
                label="Currency"
                name="currency"
                value={product.price.currency}
                onChange={handlePriceChange}
                fullWidth
                margin="normal"
              />
            </Stack>
            <Stack direction="row" gap="16px">
              <TextField
                label="Stock Quantity"
                name="stock"
                value={product.stock.stock}
                onChange={handleStockChange}
                fullWidth
                type="number"
                margin="normal"
                inputProps={{ min: "0" }}
                required
              />
              <FormControl fullWidth margin="normal">
                <Select
                  name="stockStatus"
                  value={product.stock.stockStatus}
                  onChange={(e) =>
                    handleStockChange(e as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <MenuItem value="in stock">In Stock</MenuItem>
                  <MenuItem value="out of stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <TextField
              label="Category"
              name="category"
              value={product.category.category}
              onChange={(e) =>
                setProduct((prevProduct) => ({
                  ...prevProduct,
                  category: {
                    ...prevProduct.category,
                    category: e.target.value,
                  },
                }))
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Subcategories (comma-separated)"
              name="subCategory"
              value={product.category.subCategory?.join(", ") || ""}
              onChange={(e) =>
                setProduct((prevProduct) => ({
                  ...prevProduct,
                  category: {
                    ...prevProduct.category,
                    subCategory: e.target.value
                      .split(",")
                      .map((tag) => tag.trim()),
                  },
                }))
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Tags (comma-separated)"
              name="tags"
              value={product.category.tags?.join(", ") || ""}
              onChange={(e) =>
                setProduct((prevProduct) => ({
                  ...prevProduct,
                  category: {
                    ...prevProduct.category,
                    tags: e.target.value.split(",").map((tag) => tag.trim()),
                  },
                }))
              }
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Product
            </Button>
          </Stack>
        </Stack>
      </form>
    </Container>
  );
};

export default AdminProductForm;

interface ImageComponentProps {
  url: string;
  index: number;
  removeImage: (url:string) => void;
}

const ImageComponent = ({ url, index, removeImage }: ImageComponentProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const RemoveImageFunc=()=>{
    removeImage(url)
  }

  return (
    <>
      <Box onClick={handleOpen} sx={{ cursor: 'pointer', display: 'inline-block', position:"relative" }}>
        <CardMedia
          component="img"
          image={url}
          alt={`img-${index}`}
          sx={{ borderRadius: '8px', objectFit: "cover", height: "70px", width: "70px", border: "1px solid gray" }}
        />
       <CancelIcon sx={{position:"absolute", top:"-10px", right:"-10px"}} onClick={RemoveImageFunc}/>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CardMedia
            component="img"
            image={url}
            alt={`img-${index}-modal`}
            sx={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: "contain" }}
          />
        </Box>
      </Modal>
    </>
  );
};

const ImagePagination=({product, removeImage}:{product:Product, removeImage: (url:string) => void})=>{
  const imagesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index range for the images to display
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = product.images.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(product.images.length / imagesPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const RemoveImageFunc=(value:string)=>{
  removeImage(value)
  }

  return (
    <Box width="100%">
      <Stack direction="row" justifyContent={currentImages.length >= 6 ? "space-between" : "flex-start"} gap={currentImages.length >= 6 ? "0px" : "16px"}>
        {currentImages.map((url: string, index: number) => (
          <ImageComponent key={index} url={url} index={index} removeImage={RemoveImageFunc}/>
        ))}
      </Stack>
      {
      currentImages.length>0 &&
      <Box display="flex" justifyContent="center" alignItems="center" mt={2} width="100%">
        <Button onClick={handlePrev} disabled={currentPage === 1}>
          Previous
        </Button>
        <Typography variant="body1" mx={2}>
          {`Page ${currentPage} of ${totalPages}`}
        </Typography>
        <Button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </Button>
      </Box>
      }
    </Box>
  );
}