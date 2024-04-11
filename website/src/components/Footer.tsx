import { useState } from "preact/hooks";
import { GameProjectileInventory, GameSpaceshipInventory } from "./GameItem";
import { useStore } from "@nanostores/preact";
import { userInventory } from "../store/imxStore";
import { userBalance } from "../store/imxStore";

const Footer = () => {
  const $userInventory = useStore(userInventory);
  const $userBalance = useStore(userBalance);
  return (
    <footer class="py-2 pb-4 mt-4">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center justify-center">
          <div class="w-full sm:w-1/2 lg:w-1/4 px-4">
            <h3 class="text-white text-lg mb-2">Links</h3>
            <ul class="list-reset">
              <li class="mt-2">
                <a href="/" class="text-gray-400 hover:text-white">
                  Home
                </a>
              </li>
              <li class="mt-2">
                <a href="https://github.com/emergy-official/invaders.sampleweb3.dev" target="_blank" class="text-gray-400 hover:text-white">
                  Github
                </a>
              </li>
            </ul>
          </div>

          <div class="w-full sm:w-1/2 lg:w-1/4 px-4 flex justify-center">
            <img src="/images/logo.png" />
          </div>

          <div class="w-full sm:w-1/2 lg:w-1/4 px-4 mt-6 sm:mt-0">
            <h3 class="text-white text-lg mb-2">Built for <a href="https://www.alchemy.com/university" class="stackup-link" target="_blank">Alchemy University</a></h3>
          </div>

          <div class="w-full sm:w-1/2 lg:w-1/4 px-4 mt-6 sm:mt-0">
            <p class="text-white text-sm">
              © {new Date().getFullYear()}, All rights reserved.
            </p>
            <p class="text-gray-400 text-sm mt-2">
              Made with ❤️ with Astro
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
