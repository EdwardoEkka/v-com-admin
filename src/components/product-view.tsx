import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Stack,
  Grid,
} from "@mui/material";
import { Product } from "../types";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const productRef = ref(database, "products");

    onValue(productRef, (snapshot) => {
      const data = snapshot.val();
      const productList = data ? Object.values(data) : [];
      setProducts(productList as Product[]);
      console.log(productList);
    });
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 5,
        p: 3,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 2,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {products.map((product: any, index) => (
        <Card sx={{ height: "250px", display: "flex", flexDirection: "row" }}>
          <Grid container columns={5} spacing={1}>
            <Grid item xs={2}>
              {product.images[0] && (
                <CardMedia
                  component="img"
                  image={product.images[0]}
                  alt={product.name}
                  sx={{ height: "100%", width: "100%", objectFit: "cover" }}
                />
              )}
            </Grid>
            <Grid item xs={3}>
              <CardContent sx={{ display: "flex", gap: "16px" }}>
                <Stack sx={{ textAlign: "left", gap: "8px" }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 1,
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 3,
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Stack direction="row" gap="16px">
                    <Typography variant="body1">
                      Price:{" "}
                      <span style={{ textDecoration: "line-through" }}>
                        {product.price.currency} {product.price.price}
                      </span>
                    </Typography>
                    <Typography variant="body1">
                      {product.price.currency} {product.price.discountedPrice}
                    </Typography>
                    <Typography variant="body2">
                      Stock: {product.stock.stock} ({product.stock.stockStatus})
                    </Typography>
                  </Stack>
                  <Typography variant="body2">
                    Category: {product.category.category}
                  </Typography>
                  {product.category.subCategory.length > 0 && (
                    <Typography variant="body2">
                      Subcategories: {product.category.subCategory.join(", ")}
                    </Typography>
                  )}
                  {product.category.tags.length > 0 && (
                    <Typography variant="body2">
                      Tags: {product.category.tags.join(", ")}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      ))}
    </Container>
  );
};

export default ProductList;
