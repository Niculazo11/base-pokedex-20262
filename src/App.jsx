import { useEffect, useRef, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { COLORS, BODY_FONT } from "./constants";
import { getAllPokemonList } from "./services/pokeapi";
import Navbar from "./components/Navbar";
import Home from "./views/Home";
import GenerationView from "./views/GenerationView";
import DetailView from "./views/DetailView";

export default function App() {
  const navigate = useNavigate();
  const [allList, setAllList] = useState(null);
  const [homeSearch, setHomeSearch] = useState("");
  const [genMenuOpen, setGenMenuOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    getAllPokemonList().then(setAllList).catch(() => {});
  }, []);

  const goHome = () => { navigate("/"); setGenMenuOpen(false); };
  const goGeneration = (genId) => { navigate(`/gen/${genId}`); setGenMenuOpen(false); };
  const goDetail = (name) => { navigate(`/pokemon/${name}`); setGenMenuOpen(false); };
  const handleSearchClick = () => {
    goHome();
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const homeElement = (
    <Home
      onSelectGeneration={goGeneration}
      onSelectPokemon={goDetail}
      allList={allList}
      searchQuery={homeSearch}
      setSearchQuery={setHomeSearch}
      searchInputRef={searchInputRef}
    />
  );

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: COLORS.page }}
      onClick={() => genMenuOpen && setGenMenuOpen(false)}
    >
      <Navbar
        onHome={goHome}
        onSearchClick={handleSearchClick}
        genMenuOpen={genMenuOpen}
        onToggleGenMenu={() => setGenMenuOpen((v) => !v)}
        onJumpGen={goGeneration}
      />

      <Routes>
        <Route path="/" element={homeElement} />
        <Route path="/gen/:id" element={<GenerationView onBack={goHome} onSelectPokemon={goDetail} />} />
        <Route path="/pokemon/:name" element={<DetailView onBack={goHome} />} />
        <Route path="*" element={homeElement} />
      </Routes>

      <footer className="text-center py-8 text-xs font-bold text-gray-400" style={{ fontFamily: BODY_FONT }}>
        Data from PokéAPI &amp; Pokémon TCG API
      </footer>
    </div>
  );
}
