import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Container,
  Typography,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Iconify from "../components/iconify";

export default function RecordCaloriesPage() {
  const [calories, setCalories] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0,
    drinks: 0,
  });
  const [formData, setFormData] = useState({
    meal: "breakfast",
    foodName: "",
    foodCalories: "",
  });
  const [foodAdded, setFoodAdded] = useState(false); // State to track food addition success
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const response = await fetch(`/api/foodItemsByDate?date=${today}`);
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data.foodItems);
        } else {
          console.error("Failed to fetch food items:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching food items", error);
      }
    };
    fetchFoodItems();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { meal, foodName, foodCalories } = formData;
    const calorieToAdd = parseInt(foodCalories);
    if (!isNaN(calorieToAdd) && calorieToAdd > 0) {
      try {
        const response = await fetch("/api/addFood", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mealType: meal,
            mealName: foodName,
            calories: calorieToAdd,
            dateAdded: new Date().toISOString().split("T")[0], // Add dateAdded field
          }),
        });
        if (response.ok) {
          setFoodAdded(true);
          setCalories((prevCalories) => ({
            ...prevCalories,
            [meal]: prevCalories[meal] + calorieToAdd,
          }));
          setFormData({
            meal: "breakfast",
            foodName: "",
            foodCalories: "",
          });
        }
      } catch (error) {
        console.error("Error adding food:", error);
      }
    } else {
      alert("Please enter a valid number of calories");
    }
  };

  return (
    <>
      <Helmet>
        <title>Log Calories | Minimal UI</title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Log Calories
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleSubmit}
          >
            Log Calories
          </Button>
        </Stack>

        {foodAdded && (
          <Typography variant="body1" color="success">
            Food added successfully!
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="meal-label">Select Meal</InputLabel>
            <Select
              labelId="meal-label"
              id="meal"
              name="meal"
              value={formData.meal}
              onChange={handleInputChange}
            >
              <MenuItem value="breakfast">Breakfast</MenuItem>
              <MenuItem value="lunch">Lunch</MenuItem>
              <MenuItem value="dinner">Dinner</MenuItem>
              <MenuItem value="snacks">Snacks</MenuItem>
              <MenuItem value="drinks">Drinks</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Food Name"
            id="foodName"
            name="foodName"
            value={formData.foodName}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            fullWidth
            type="number"
            label="Calories"
            id="foodCalories"
            name="foodCalories"
            value={formData.foodCalories}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Add Food
          </Button>
        </form>

        <Typography variant="h6" gutterBottom mt={4}>
          Calories Added Today
        </Typography>

        <Typography>Breakfast: {calories.breakfast} kcal</Typography>
        <Typography>Lunch: {calories.lunch} kcal</Typography>
        <Typography>Dinner: {calories.dinner} kcal</Typography>
        <Typography>Snacks: {calories.snacks} kcal</Typography>
        <Typography>Drinks: {calories.drinks} kcal</Typography>

        {/* Display food items consumed today */}
        <Typography variant="h6" gutterBottom mt={4}>
          Food Consumed Today
        </Typography>
        {dashboardData &&
          dashboardData.map((item, index) => (
            <div key={index}>
              <Typography>
                {item.mealType}: {item.mealName} - {item.calories} kcal
              </Typography>
            </div>
          ))}
      </Container>
    </>
  );
}
