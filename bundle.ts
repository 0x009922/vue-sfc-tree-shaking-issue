import { build } from 'vite'
import vue from'@vitejs/plugin-vue'
import consola from 'consola'
import fs from 'fs/promises'
import chalk from 'chalk'

async function buildEntry(name: string) {
    await build({
        plugins: [vue()],
        build: {
            target: 'esnext',
            lib: {
                entry: `src/${name}.ts`,
                formats: ['es'],
                fileName: name
            },
            emptyOutDir: false,
            rollupOptions: {
                external: []
            }
        },
        clearScreen: false,
    })
}

async function audit(name: string) {
    const contents = await fs.readFile(`dist/${name}.es.js`, { encoding: 'utf-8' })

    const COMPONENTS = ['MyModal', 'MyInput', 'MyButton', 'MyAnchor']

    const componentsMapped = COMPONENTS.map(component => {
        const found = contents.includes(component)
        return `  ${component}: ${found ? chalk.bold.red('Yes') : chalk.bold.green('No')}`
    }).join('\n')

    consola.info(`Audit: ${name}\n${componentsMapped}`)
}

async function main() {
    const ENTRIES = ['entry-1', 'entry-2', 'entry-3']

    for (const entry of ENTRIES) {
        await buildEntry(entry)
    }

    for (const entry of ENTRIES) {
        await audit(entry)
    }

}

main().catch(err => {
    consola.fatal(err)
    process.exit(1)
})
