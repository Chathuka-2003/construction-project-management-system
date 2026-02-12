import React from "react";
import { HeroSlideshow } from "../components/home/HeroSlideshow";
import { Welcome } from "../components/home/Welcome";

export default function Home() {
  return (
    <div>
      <HeroSlideshow />
      <Welcome />
    </div>
  );
}
