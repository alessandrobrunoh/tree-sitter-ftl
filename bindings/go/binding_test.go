package tree_sitter_jdl_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_jdl "github.com/tree-sitter/tree-sitter-jdl/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_jdl.Language())
	if language == nil {
		t.Errorf("Error loading Jdl grammar")
	}
}
