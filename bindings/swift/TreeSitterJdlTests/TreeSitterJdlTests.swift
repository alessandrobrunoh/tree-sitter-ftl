import XCTest
import SwiftTreeSitter
import TreeSitterJdl

final class TreeSitterJdlTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_jdl())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Jdl grammar")
    }
}
