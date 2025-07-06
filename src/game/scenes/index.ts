import BootScene from '@src/game/scenes/boot/BootScene';
import PreloadScene from '@src/game/scenes/preload/PreloadScene';
import StartScene from '@src/game/scenes/start/StartScene';
import GameScene from '@src/game/scenes/game/GameScene';
import TutorialScene from '@src/game/scenes/tutorial/TutorialScene';
import SwitchScene from '@src/game/scenes/switch/SwitchScene';
import EndScene from '@src/game/scenes/end/EndScene';

export * from './types/scene.types.ts';
export const scenes = [BootScene, PreloadScene, StartScene, TutorialScene, GameScene, SwitchScene, EndScene];
