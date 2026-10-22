import { createContext, useContext, useEffect,useState,useMemo } from "react";
import { fetchCategories, fetchProducts } from "../api/api";


const ProductContext = createContext()

export const ProductProvider =({children}) =>{
const [products,setProducts] = useState([])
const [categories, setCategories] = useState([]);
const [isLoading,setIsLoading] = useState(true)
const [error,setError] = useState(null)

 // Filter & Search states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minRating, setMinRating] = useState(1);
  const [sortBy, setSortBy] = useState(""); // "low_to_high" | "high_to_low" | ""
  const [searchTerm, setSearchTerm] = useState("");


const loadInitialData = async()=>{
     setIsLoading(true)
     setError(null)
    try{
     const prodRes = await fetchProducts()
     const catRes = await fetchCategories()

     if(prodRes.success && catRes.success){
        setProducts(prodRes.data.products)
        setCategories(catRes.data.categoryList)
     }

    }catch(err){
        console.log("Error while product fetch");
        setError(err.message || "Failed to load products");
    }finally{
        setIsLoading(false)
    }
}

useEffect(() =>{
    loadInitialData()
},[])

// Toggle category checkbox selection
  const toggleCategory = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  // Reset all filters to default state
  const clearFilters = () => {
    setSelectedCategories([]);
    setMinRating(1);
    setSortBy("");
    setSearchTerm("");
  };
//To avoid expensive operations it remembers prev op
 const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    // 2. Category checkboxes filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // 3. Rating slider filter
    if (minRating > 1) {
      result = result.filter((p) => (p.rating || 0) >= minRating);
    }

    // 4. Sort by Price
    if (sortBy === "low_to_high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high_to_low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchTerm, selectedCategories, minRating, sortBy]);


return (
    <ProductContext.Provider
    value={{
        products,
        categories,
        filteredProducts,
        isLoading,
        error,
        selectedCategories,
        setSelectedCategories,
        toggleCategory,
        minRating,
        setMinRating,
        sortBy,
        setSortBy,
        searchTerm,
        setSearchTerm,
        clearFilters,
        reloadProducts: loadInitialData,
      }}
    >
        {children}
    </ProductContext.Provider>
)
}

export const useProducts =()=>{
    const context = useContext(ProductContext)
    if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}