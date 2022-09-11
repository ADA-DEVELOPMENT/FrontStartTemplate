import Env from '../core/Env'
import { modules } from '../config/settings'

const EnvModules = new Env()

EnvModules.moduleRegister(modules)

export const AppVue = {}
export const AppModules = EnvModules