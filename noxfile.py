"""Nox sessions for Jupyter Book blog."""

import nox

# Use uv for faster installs
nox.options.default_venv_backend = "uv|virtualenv"

@nox.session(name="build")
def build_plugin(session):
    """Build the blog plugin using esbuild."""
    session.run("npm", "install", external=True)
    session.run("npm", "run", "build", external=True)
    session.run("cp", "dist/plugin.mjs", "docs/plugin.mjs")

@nox.session(name="docs")
def docs(session):
    """Build the documentation as static HTML."""
    session.install("mystmd")
    build_plugin(session)
    session.chdir("docs")
    session.run("myst", "build", "--html")


@nox.session(name="docs-live")
def docs_live(session):
    """Start a live development server for the documentation."""
    session.install("mystmd")
    build_plugin(session)
    session.chdir("docs")
    session.run("myst", "start")


@nox.session
def clean(session):
    """Clean the documentation build artifacts."""
    session.install("mystmd")
    session.chdir("docs")
    session.run("mystmd", "clean")
