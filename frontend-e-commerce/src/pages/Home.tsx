import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";

const Home = () => {
  const addToCartHandler = () => {};
  return (
    <>
      <div className="home">
        <section></section>
        <h1>
          Latest Products
          <Link to="/search" className="findmore">
            More
          </Link>
        </h1>

        <main>
          <ProductCard
            productId="jsjs"
            name="Notebook"
            price={66}
            stock={67}
            handler={addToCartHandler}
            photo="https://bestcorporategiftsmumbai.com/uploads/products/1601374200_A5557F~1.JPG"
          />
        </main>
      </div>
    </>
  );
};

export default Home;
