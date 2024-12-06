import React, { useRef } from "react";
import { Col, Form, Row } from "react-bootstrap";

interface iSearchBarProps {
    onChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => void;
    filterList?: iFilterList[];
}

interface iFilterList {
    title: string;
    list: {
        value: number;
        label: string;
    }[];
}

function SearchBar(props: iSearchBarProps) {
    const { onChange, filterList } = props;
    const inputSearch = useRef(null);

    return (
        <Form>
            <Row>
                <Col md="3" className="mb-3">
                    <Form.Control
                        type="text"
                        name="q"
                        ref={inputSearch}
                        autoComplete="off"
                        placeholder="Tìm kiếm trong danh sách ..."
                        className=" mr-sm-2"
                        onChange={onChange}
                    />
                </Col>
                {filterList &&
                    filterList.map((filter, index) => (
                        <Col md="3" key={index} className="mb-3">
                            <Form.Select
                                name={filter.title}
                                onChange={onChange}
                            >
                                <option value="">
                                    ----Lọc: {filter.title}----
                                </option>
                                {filter.list.map((item, itemIndex) => (
                                    <option key={itemIndex} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    ))}
            </Row>
        </Form>
    );
}

export default SearchBar;
